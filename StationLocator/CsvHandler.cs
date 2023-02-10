using CsvHelper;
using CsvHelper.Configuration;
using StationLocator.Models;
using System;
using System.Diagnostics.Metrics;
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

        public static List<string> FindStations(float longitude, float latitude, string country, int years, int radius, int count)
        {
            return new List<string>();
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
