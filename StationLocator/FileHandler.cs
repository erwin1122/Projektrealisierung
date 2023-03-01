using System.IO.Compression;
using System.Text.RegularExpressions;

namespace StationLocator
{
    public class FileHandler
    {
        private static string _stationFolder = Path.GetRelativePath(Directory.GetCurrentDirectory(), "Files/Stations/");

        public static async Task<bool> DownloadStationById(string id)
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
            return true;
        }

        private static bool CheckStationFileAlreadyOnSystem(string id)
        {
            string[] files = Directory.GetFiles(_stationFolder);
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
            var response2 = await client.GetAsync("https://www1.ncdc.noaa.gov/pub/data/ghcn/daily/ghcnd-inventory.txt");
            SaveFile(response2, "ghcnd-inventory.txt");

            CleanUpStationsFile();
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
            string stationPath = Path.GetRelativePath(Directory.GetCurrentDirectory(), "Files/ghcnd-stations.txt");
            string[] stations = File.ReadAllLines(stationPath);
            List<string> cleanedLines = new List<string>();

            string inventoryPath = Path.GetRelativePath(Directory.GetCurrentDirectory(), "Files/ghcnd-inventory.txt");
            List<string> inventories = File.ReadAllLines(inventoryPath).Where(line => line.Contains("TMAX")).ToList();

            Dictionary<string, string> inventoryById = new Dictionary<string, string>();

            foreach (string inventory in inventories)
            {
                string id = inventory.Split(" ")[0];

                inventoryById[id] = inventory;
            }

            foreach (string line in stations)
            {
                List<string?> cleanStrings = new List<string?>();
                List<string> numbers = Regex.Matches(line, "[-+]?[0-9]+\\.[0-9]+").Cast<Match>().Select(match => match.Value).ToList();

                cleanStrings.Add(line.Substring(0, 11));
                cleanStrings.Add(numbers[0]);
                cleanStrings.Add(numbers[1]);
                cleanStrings.Add(numbers[2]);
                cleanStrings.Add(Regex.Match(line.Substring(line.LastIndexOf(".") + 5), @"((?!\s{2}).)+").Value.Trim());

                if(inventoryById.TryGetValue(line.Substring(0, 11), out string? inventory))
                {
                    string[] years = Regex.Matches(inventory, "(\\d{4})\\s(\\d{4})").Cast<Match>().Select(match => match.Value).ToList()[0].Split(" ");
                    cleanStrings.Add(years[0]);
                    cleanStrings.Add(years[1]);
                } else
                {
                    cleanStrings.Add(null);
                    cleanStrings.Add(null);
                }
                
                cleanedLines.Add(string.Join(";;", cleanStrings));
            }

            File.WriteAllLines(Path.GetRelativePath(Directory.GetCurrentDirectory(), "Files/ghcnd-stations.csv"), cleanedLines);
            File.Delete(stationPath);
            File.Delete(inventoryPath);
        }
    }
}
