using CsvHelper.Configuration.Attributes;

namespace StationLocator.Models
{
    public class Station
    {
        [Index(0)]
        public string? id { get; set; }
        [Index(1)]
        public string? longitude { get; set; }
        [Index(2)]
        public string? latitude { get; set; }
        [Index(3)]
        public string? asl { get; set; }
        [Index(4)]
        public string? location { get; set; }
        [Ignore]
        public string? distance { get; set; }
    }
}
