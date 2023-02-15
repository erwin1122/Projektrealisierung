using CsvHelper.Configuration.Attributes;

namespace StationLocator.Models
{
    public class Inventory
    {
        [Index(0)]
        public string? id { get; set; }
        [Index(1)]
        public string? latitude { get; set; }
        [Index(2)]
        public string? longitude { get; set; }
        [Index(3)]
        public string? type { get; set; }
        [Index(4)]
        public int? startYear { get; set; }
        [Index(5)]
        public int? endYear { get; set; }
    }
}
