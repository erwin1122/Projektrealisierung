using Microsoft.AspNetCore.Mvc;
using StationLocator.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace StationLocator.Controllers
{
    [Route("WeatherStation")]
    [ApiController]
    public class WeatherStationController : ControllerBase
    {
        // GET WeatherStation/
        [HttpGet]
        public List<Station> Get([FromQuery] float longitude, [FromQuery] float latitude, [FromQuery] string country = "", [FromQuery] int years = -1, [FromQuery] int radius = -1, [FromQuery] int count = 1)
        {
            List<string> stationIds = CsvHandler.FindStations(longitude, latitude, country, years, radius, count);
            List<Station> stations = new List<Station>();

            foreach(string stationId in stationIds)
            {
                stations.Add(CsvHandler.GetStationById(stationId));
            }

            CsvHandler.GetMeanTemp("AGE00147708", "2022");

            return stations;
        }

        [HttpGet("/{id}/all")]
        public string GetAll(string id)
        {
            FileHandler.DownloadStationById(id);

            return $"{id}";
        }

        [HttpGet("/{id}/range")]
        public string GetRange(string id, [FromQuery] int startYear, [FromQuery] int endYear)
        {
            FileHandler.DownloadStationById(id);

            return $"{id}";
        }

        [HttpGet("/{id}/year")]
        public string GetYear(string id, [FromQuery] int year)
        {
            FileHandler.DownloadStationById(id);

            return $"{id}";
        }

        [HttpGet("/{id}/month")]
        public string GetMonth(string id, [FromQuery] int year, [FromQuery] int month)
        {
            FileHandler.DownloadStationById(id);

            return $"{id}";
        }
    }
}
