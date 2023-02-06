using CsvHelper.Configuration.Attributes;

namespace StationLocator.Models
{
    public class TempValue
    {
        public int? year { get; set; }
        public int? month { get; set; }
        public int? day { get; set; }
        public float? minTemp { get; set; }
        public float? maxTemp { get; set; }
        public float? minTempF { get; set; }
        public float? minTempS { get; set; }
        public string? scope { get; set; }
        public string? _type { get; set; }
    }
}
