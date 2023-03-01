using CsvHelper.Configuration.Attributes;

namespace StationLocator.Models
{
    public class TempValueCSV
    {
        [Index(1)]
        public string? _date { get; set; }

        [Index(2)]
        public string? _type { get; set; }

        [Index(3)]
        public float _value { get; set; }

        [Ignore]
        public int? year
        {
            get { if (_date == null) { return null; } else return int.Parse(_date.Substring(0, 4)); }
            set { }
        }

        [Ignore]
        public int? month
        {
            get { if (_date == null) { return null; } else return int.Parse(_date.Substring(4, 2)); }
            set { }
        }

        [Ignore]
        public int? day
        {
            get { if (_date == null) { return null; } else return int.Parse(_date.Substring(6, 2)); }
            set { }
        }

        [Ignore]
        public float? minTemp
        {
            get { if (_type == "TMIN") { return _value / 10; } else return null; }
            set { }
        }

        [Ignore]
        public float? maxTemp
        {
            get { if (_type == "TMAX") { return _value / 10; } else return null; }
            set { }
        }

        [Ignore]
        public string? scope { get; set; }

    }
}