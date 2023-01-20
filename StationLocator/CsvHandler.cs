using CsvHelper;
using CsvHelper.Configuration;
using StationLocator.Models;
using System.Diagnostics.Metrics;
using System.Globalization;

namespace StationLocator
{
    public class CsvHandler
    {
        public static Station GetStationById(string id)
        {
            return new Station();
        }

        public static List<string> FindStations(float longitude, float latitude, string country, int years, int radius, int count)
        {
            return new List<string>();
        }

        public static void GetMeanTemp(string id, string year, string month = "00")
        {
            using var reader = new StreamReader(Path.GetRelativePath(Directory.GetCurrentDirectory(), $"Files/Stations/{id}-{DateTime.Now.ToString("yyyy-MM-dd")}.csv"));
            var config = new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = ",", HasHeaderRecord = false };
            using var csv = new CsvReader(reader, config);
            {
                string searchString = $"{year}{month}";
                if(month == "00")
                {
                    searchString = $"{year}";
                }

                List<Entry> records = csv.GetRecords<Entry>().Where(r => r.Date.StartsWith(searchString)).ToList();

                float maxMean = CalculateMeanTemp(records, "TMAX");
                float minMean = CalculateMeanTemp(records, "TMIN");
            }
        }

        private static float CalculateMeanTemp(List<Entry> records, string type)
        {
            IEnumerable<Entry> recordsOfType =  records.Where(r => r.Type == type);

            return recordsOfType.Sum(r => r.Value) / recordsOfType.Count();
        }
    }
}
