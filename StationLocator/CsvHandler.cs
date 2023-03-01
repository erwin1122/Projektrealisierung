using CsvHelper;
using CsvHelper.Configuration;
using StationLocator.Models;
using System;
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

            return csv.GetRecords<TempValueCSV>()
                     .Where(r => r._type == "TMAX" || r._type == "TMIN")
                     .Select(x => new TempValue
                     {
                         date = x.date,
                         maxTemp = x.maxTemp,
                         minTemp = x.minTemp,
                         _type = x._type
                     })
                     .ToList();
        }

        public static List<Station> FindStations(float latitude, float longitude, string? country, int? startYear, int? endYear, int? radius, int count)
        {
            using var reader = new StreamReader(Path.GetRelativePath(Directory.GetCurrentDirectory(), $"Files/ghcnd-stations.csv"));
            var config = new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = ";;", HasHeaderRecord = false, BadDataFound = null, MissingFieldFound = null};
            using var csv = new CsvReader(reader, config);

            var stations = csv.GetRecords<Station>().ToList();

            // Filter by country
            if (!string.IsNullOrEmpty(country))
            {
                stations = stations.Where(station => station.id.StartsWith(country)).ToList();
            }

            // Calculate distances to all stations
            stations.ForEach(station => station.distance = CalculateDistance(Convert.ToDouble(longitude), Convert.ToDouble(latitude), Convert.ToDouble(station.longitude.Replace(".", ",")), Convert.ToDouble(station.latitude.Replace(".", ","))));

            // Filter by radius
            if (radius != null)
            {
                stations = stations.Where(station => station.distance <= radius).ToList();
            }

            // Filter by year range
            if (startYear != null || endYear != null)
            {
                stations = stations.Where(station => IsInDateRange(station, startYear, endYear)).ToList();
            }

            // Sort stations by distance
            stations = stations.OrderBy(station => station.distance).ToList();

            return stations.Take(count).ToList();
        }

        private static bool IsInDateRange(Station station, int? startYear, int? endYear)
        {
            if (startYear != null && endYear != null)
            {
                return station.startYear <= startYear && station.endYear >= endYear;
            }

            if (startYear != null)
            {
                return station.startYear <= startYear;
            }

            if (endYear != null)
            {
                return station.endYear >= endYear;
            }

            return false;
        }

        private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            double dLat = ToRadians(lat2 - lat1);
            double dLon = ToRadians(lon2 - lon1);
            lat1 = ToRadians(lat1);
            lat2 = ToRadians(lat2);

            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) + Math.Sin(dLon / 2) * Math.Sin(dLon / 2) * Math.Cos(lat1) * Math.Cos(lat2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            double d = 6378.137 * c;

            return d;
        }

        private static double ToRadians(double angle)
        {
            return Math.PI * angle / 180.0;
        }

        public static Station GetStationById(string id)
        {
            using var reader = new StreamReader(Path.GetRelativePath(Directory.GetCurrentDirectory(), $"Files/ghcnd-stations.csv"));
            var config = new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = ";;", HasHeaderRecord = false };
            using var csv = new CsvReader(reader, config);
            {
                Station station = csv.GetRecords<Station>().Where(r => r.id == id).First();
                return station;
            }
        }

        public static List<TempValue> GetMeanTempYears(List<TempValue> tempValues, List<TempValue> allTempValues)
        {
            List<TempValue> filteredTemps = new List<TempValue>();

            IEnumerable<IGrouping<int, TempValue>> yearGrouping = tempValues.OrderBy(value => value.date.Year).GroupBy(value => value.date.Year);

            foreach (IGrouping<int, TempValue> year in yearGrouping)
            {

                List<TempValue> values = new List<TempValue>();

                foreach (TempValue tempValue in year)
                {
                    values.Add(tempValue);
                }

                filteredTemps.Add(new TempValue()
                {
                    date = new DateTime(year: year.Key, month: 1, day: 1),
                    scope = "years",
                    maxTemp = CalculateMeanTemp(values, "TMAX"),
                    minTemp = CalculateMeanTemp(values, "TMIN"),
                    minTempW = CalculateMeanTempSeason(values, "TMIN", "winter", allTempValues),
                    minTempF = CalculateMeanTempSeason(values, "TMIN", "spring"),
                    minTempS= CalculateMeanTempSeason(values, "TMIN", "summer"),
                    minTempH= CalculateMeanTempSeason(values, "TMIN", "autumn"),
                    maxTempW = CalculateMeanTempSeason(values, "TMAX", "winter", allTempValues),
                    maxTempF = CalculateMeanTempSeason(values, "TMAX", "spring"),
                    maxTempS= CalculateMeanTempSeason(values, "TMAX", "summer"),
                    maxTempH= CalculateMeanTempSeason(values, "TMAX", "autumn")
                });
            }
            return filteredTemps;
        }

        public static List<TempValue> GetMeanTempMonths(List<TempValue> tempValues) { 
            List<TempValue> filteredTemps = new List<TempValue>();

            IEnumerable<IGrouping<int, TempValue>> monthGrouping = tempValues.OrderBy(value => value.date.Month).GroupBy(value => value.date.Month);

            foreach (IGrouping<int, TempValue> month in monthGrouping)
            {

                List<TempValue> values = new List<TempValue>();

                foreach (TempValue tempValue in month)
                {
                    values.Add(tempValue);
                }

                TempValue test = new TempValue()
                {
                    date = new DateTime(values[0].date.Year, month.Key, 1),
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
            var recordsOfType = records.Where(record => record._type == type);

            return type switch
            {
                "TMAX" => CalcMean(recordsOfType.Select(r => r.maxTemp)),
                "TMIN" => CalcMean(recordsOfType.Select(r => r.minTemp)),
                _ => null
            };
        }

        private static float? CalculateMeanTempSeason(List<TempValue>? records, string type, string season, List<TempValue>? allTempValues = null)
        {
            if (records == null) { return null; }

            var recordsOfType = records.Where(record => record._type == type);

            recordsOfType = season switch
            {
                "spring" => recordsOfType.Where(x => x.date.Month >= 3 && x.date.Month <= 5),
                "summer" => recordsOfType.Where(x => x.date.Month >= 6 && x.date.Month <= 8),
                "autumn" => recordsOfType.Where(x => x.date.Month >= 9 && x.date.Month <= 11),
                "winter" => GetWinterMonths(recordsOfType.Where(x => x.date.Month == 1 || x.date.Month == 2).ToList(), allTempValues),
                _ => new List<TempValue>()
            };

            return type switch
            {
                "TMAX" => CalcMean(recordsOfType.Select(r => r.maxTemp)),
                "TMIN" => CalcMean(recordsOfType.Select(r => r.minTemp)),
                _ => null
            };
        }

        private static float? CalcMean(IEnumerable<float?> values)
        {
            var validValues = values.Where(v => v.HasValue);
            var count = validValues.Count();

            if (count == 0)
            {
                return null;
            }

            return validValues.Sum() / count;
        }

        private static IEnumerable<TempValue> GetWinterMonths(List<TempValue> records, List<TempValue>? allTempValues)
        {
            if (records.Count == 0 || allTempValues == null) { return records; }

            int? year = records[0].date.Year;

            var lastYearRecords = allTempValues
                .Where(value => value.date.Year == year - 1 && value.date.Month == 12)
                .ToList();

            records.AddRange(lastYearRecords);

            return records.Where(x => x.date.Month == 12 || x.date.Month == 1 || x.date.Month == 2);
        }
    }
}
