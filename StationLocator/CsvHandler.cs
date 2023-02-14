using CsvHelper;
using CsvHelper.Configuration;
using StationLocator.Models;
using System;
using System.Diagnostics;
using System.Globalization;

namespace StationLocator
{
    public class CsvHandler
    {
        public static List<TempValue> GetStationValuesById(string id)
        {
            using var reader = new StreamReader(Path.GetRelativePath(Directory.GetCurrentDirectory(), $"Files/Stations/{id}-{DateTime.Now.ToString("yyyy-MM-dd")}.csv"));
            var config = new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = ",", HasHeaderRecord = false };
            using var csv = new CsvReader(reader, config);
            {
                List<TempValueCSV> records = csv.GetRecords<TempValueCSV>().Where(r => r._type == "TMAX" || r._type == "TMIN").ToList();
                List<TempValue> cleanRecords = records.Select(x => new TempValue { year = x.year, month = x.month, day = x.day, maxTemp = x.maxTemp, minTemp = x.minTemp, _type = x._type }).ToList();

                return cleanRecords;
            }
        }

        public static List<Station> FindStations(float longitude, float latitude, string? country, int? start_year, int? end_year, int? radius, int count)
        {
            using var reader = new StreamReader(Path.GetRelativePath(Directory.GetCurrentDirectory(), $"Files/ghcnd-stations.csv"));
            var config = new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = ",", HasHeaderRecord = false, BadDataFound = null, MissingFieldFound = null};
            using var csv = new CsvReader(reader, config);

            var records = csv.GetRecords<Station>().ToList();

            //länderfilter
            var country_filtered_records = records.Where(records => records.id.StartsWith(country));


            // Berechne die Distanzen zu allen Stationen
            foreach (Station station in country_filtered_records)
            {
                station.distance = CalculateDistance(Convert.ToDouble(latitude), Convert.ToDouble(longitude), Convert.ToDouble(station.latitude.Replace(".", ",")), Convert.ToDouble(station.longitude.Replace(".", ",")));
            }

            // Sortiere die Liste der Stationen nach Entfernung
            records = country_filtered_records.OrderBy(r => r.distance).ToList();

            if (records.Count < count)
            {
                return records;
            } else
            {
                return records.GetRange(0, count);
            }
            
        }

        private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            double dLat = ToRadians(lat2 - lat1);
            double dLon = ToRadians(lon2 - lon1);
            lat1 = ToRadians(lat1);
            lat2 = ToRadians(lat2);

            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) + Math.Sin(dLon / 2) * Math.Sin(dLon / 2) * Math.Cos(lat1) * Math.Cos(lat2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            double d = 6371 * c;

            return d;
        }

        private static double ToRadians(double angle)
        {
            return Math.PI * angle / 180.0;
        }

        public static Station GetStationById(string id)
        {
            using var reader = new StreamReader(Path.GetRelativePath(Directory.GetCurrentDirectory(), $"Files/ghcnd-stations.csv"));
            var config = new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = ",", HasHeaderRecord = false };
            using var csv = new CsvReader(reader, config);
            {
                Station station = csv.GetRecords<Station>().Where(r => r.id == id).First();
                return station;
            }
        }

        public static List<TempValue> GetMeanTempYears(List<TempValue> tempValues)
        {
            List<TempValue> filteredTemps = new List<TempValue>();

            IEnumerable<IGrouping<int?, TempValue>> yearGrouping = tempValues.OrderBy(value => value.year).GroupBy(value => value.year);

            foreach (IGrouping<int?, TempValue> year in yearGrouping)
            {

                List<TempValue> values = new List<TempValue>();

                foreach (TempValue tempValue in year)
                {
                    values.Add(tempValue);
                }

                filteredTemps.Add(new TempValue()
                {
                    year = year.Key,
                    month = 0,
                    day = 0,
                    scope = "years",
                    maxTemp = CalculateMeanTemp(values, "TMAX"),
                    minTemp = CalculateMeanTemp(values, "TMIN"),
                });
            }
            return filteredTemps;
        }

        public static List<TempValue> GetMeanTempMonths(List<TempValue> tempValues) { 
            List<TempValue> filteredTemps = new List<TempValue>();

            IEnumerable<IGrouping<int?, TempValue>> monthGrouping = tempValues.OrderBy(value => value.month).GroupBy(value => value.month);

            foreach (IGrouping<int?, TempValue> month in monthGrouping)
            {

                List<TempValue> values = new List<TempValue>();

                foreach (TempValue tempValue in month)
                {
                    values.Add(tempValue);
                }

                TempValue test = new TempValue()
                {
                    year = values[0].year,
                    month = month.Key,
                    day = 0,
                    scope = "months",
                    maxTemp = CalculateMeanTemp(values, "TMAX"),
                    minTemp = CalculateMeanTemp(values, "TMIN")
                };

                filteredTemps.Add(test);
            }

            return filteredTemps;
        }

        private static float? CalculateMeanTemp(List<TempValue> records, string type)
        {
            List<TempValue> recordsOfType = records.Where(record => record._type == type).ToList();

            if(type == "TMAX")
            {
                var value = recordsOfType.Where(x => x.maxTemp != null).Sum(r => r.maxTemp) / recordsOfType.Where(x => x.maxTemp != null).Count();

                if (value != value)
                {
                    return null;
                }
                else
                {
                    return value;
                }
            }
            if(type == "TMIN")
            {
                var value = recordsOfType.Where(x => x.minTemp != null).Sum(r => r.minTemp) / recordsOfType.Where(x => x.minTemp != null).Count();

                if (value != value)
                {
                    return null;
                }
                else
                {
                    return value;
                }
            }

            return null;
        }
    }
}
