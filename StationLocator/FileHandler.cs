using StationLocator.Models;
using System.IO.Compression;
using System.Net;
using System.Text.RegularExpressions;

namespace StationLocator
{
    public class FileHandler
    {
        private static string _stationFolder = Path.GetRelativePath(Directory.GetCurrentDirectory(), "Files/Stations/");
        public static async void DownloadStationById(string id)
        {
            if (!CheckStationFileAlreadyOnSystem(id))
            {
                string filePath = Path.Combine(_stationFolder, $"{id}-{DateTime.Now.ToString("yyyy-MM-dd")}.csv");
                using var client = new HttpClient();

                var response = await client.GetAsync($"https://www1.ncdc.noaa.gov/pub/data/ghcn/daily/by_station/{id}.csv.gz");
                var content = await response.Content.ReadAsStreamAsync();

                using FileStream decompressedFile = File.Create(filePath);
                using GZipStream decompressionStream = new GZipStream(content, CompressionMode.Decompress);
                decompressionStream.CopyTo(decompressedFile);
            }            
        }

        private static bool CheckStationFileAlreadyOnSystem(string id)
        {
            string[] files = Directory.GetFiles(_stationFolder);
            var test = Path.GetFileName(files[0]);
            var filesToDelete = files.Where(f => !Path.GetFileName(f).EndsWith($"{DateTime.Now.ToString("yyyy-MM-dd")}.csv"));

            foreach ( var file in filesToDelete)
            {
                File.Delete(file);
            }

            return File.Exists(Path.Combine(_stationFolder, $"{id}-{DateTime.Now.ToString("yyyy-MM-dd")}.csv"));
        }

        public static async void DownloadStationInventory()
        {
            using var client = new HttpClient();
            var response = await client.GetAsync("https://www1.ncdc.noaa.gov/pub/data/ghcn/daily/ghcnd-stations.txt");
            SaveFile(response, "ghcnd-stations.txt");
            CleanUpStationsFile();

            var response2 = await client.GetAsync("https://www1.ncdc.noaa.gov/pub/data/ghcn/daily/ghcnd-inventory.txt");
            SaveFile(response2, "ghcnd-inventory.txt");
            CleanUpInventoryFile();
        }

        private static async void SaveFile(HttpResponseMessage response, string filename)
        {
            using Stream streamToReadFrom = await response.Content.ReadAsStreamAsync();
            string fileToWriteTo = Path.GetRelativePath(Directory.GetCurrentDirectory(), $"Files/{filename}");
            using Stream streamToWriteTo = File.Open(fileToWriteTo, FileMode.Create);
            streamToReadFrom.CopyTo(streamToWriteTo);
        }

        private static void CleanUpStationsFile()
        {
            string file = Path.GetRelativePath(Directory.GetCurrentDirectory(), "Files/ghcnd-stations.txt");
            string[] lines = File.ReadAllLines(file);
            List<string> cleanedLines = new List<string>();

            foreach (string line in lines)
            {
                List<string> cleanStrings = new List<string>();
                List<string> numbers = Regex.Matches(line, "[-+]?[0-9]+\\.[0-9]+").Cast<Match>().Select(match => match.Value).ToList();

                cleanStrings.Add(line.Substring(0, 11));
                cleanStrings.Add(numbers[0]);
                cleanStrings.Add(numbers[1]);
                cleanStrings.Add(numbers[2]);
                cleanStrings.Add(Regex.Match(line.Substring(line.LastIndexOf(".") + 5), @"((?!\s{2}).)+").Value.Trim());

                cleanedLines.Add(string.Join(",", cleanStrings));
            }

            File.WriteAllLines(Path.GetRelativePath(Directory.GetCurrentDirectory(), "Files/ghcnd-stations.csv"), cleanedLines);
            File.Delete(file);
        }

        private static void CleanUpInventoryFile()
        {
            string file = Path.GetRelativePath(Directory.GetCurrentDirectory(), "Files/ghcnd-inventory.txt");
            string[] lines = File.ReadAllLines(file);
            List<string> cleanedLines = new List<string>();

            foreach (string line in lines)
            {
                if (line.Contains("TMAX") || line.Contains("TMIN"))
                {
                    cleanedLines.Add(string.Join(",", Regex.Matches(line, "((?!\\s).)+").Cast<Match>().Select(match => match.Value).ToList()));
                }
            }

            File.WriteAllLines(Path.GetRelativePath(Directory.GetCurrentDirectory(), "Files/ghcnd-inventory.csv"), cleanedLines);
            File.Delete(file);
        }
    }
}
