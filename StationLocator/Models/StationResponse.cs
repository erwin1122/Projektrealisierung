namespace StationLocator.Models
{
    public class StationResponse
    {
        public Station? station { get; set; }
        public List<TempValue>? values { get; set; } = new List<TempValue>();
    }
}
