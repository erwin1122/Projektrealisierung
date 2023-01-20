using CsvHelper.Configuration.Attributes;

namespace StationLocator.Models
{
    public class Entry
    {
        [Index(0)]
        public string Id { get; set; }

        [Index(1)]
        public string Date { get; set; }

        [Index(2)]
        public string Type { get; set; }

        [Index(3)]
        public int Value { get; set; }
    }
}
