using CsvHelper.Configuration.Attributes;

namespace StationLocator.Models
{
    public class TempValue
    {
        public string? id { get; set; }
        public int? year { get; set; }
        public int? month { get; set; }
        public int? day { get; set; }
        public float? minTemp { get; set; }
        public float? maxTemp { get; set; }
        public float? minTempF { get; set; }
        public float? minTempS { get; set; }
        public float? minTempH { get; set; }
        public float? minTempW { get; set; }
        public float? maxTempF { get; set; }
        public float? maxTempS { get; set; }
        public float? maxTempH { get; set; }
        public float? maxTempW { get; set; }
        public string? scope { get; set; }
        public string? _type { get; set; }
    }
}
