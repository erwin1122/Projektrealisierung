using Microsoft.AspNetCore.Mvc;
using StationLocator.Models;
using System.Diagnostics;

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

            //foreach(string stationId in stationIds)
            //{
            //    stations.Add(CsvHandler.GetStationById(stationId));
            //}

            //CsvHandler.GetMeanTemp("AGE00147708", "2022");

            return stations;
        }

        [HttpGet("/{id}/range")]
        public async Task<StationResponse> GetRange(string id, [FromQuery] int startYear, [FromQuery] int endYear)
        {
            await FileHandler.DownloadStationById(id);
            List<TempValue> tempValues = CsvHandler.GetStationValuesById(id).Where(value => value.year >= startYear && value.year <= endYear).ToList();
            
            return new StationResponse { station = new Station() { id = id }, values = CsvHandler.GetMeanTempYears(tempValues) };
        }

        [HttpGet("/{id}/year")]
        public async Task<StationResponse> GetYear(string id, [FromQuery] int year)
        {
            await FileHandler.DownloadStationById(id);
            List<TempValue> tempValues = CsvHandler.GetStationValuesById(id).Where(value => value.year == year).ToList();

            return new StationResponse { station = new Station() { id = id }, values = CsvHandler.GetMeanTempMonths(tempValues) };
        }

        [HttpGet("/{id}/month")]
        public async Task<StationResponse> GetMonth(string id, [FromQuery] int year, [FromQuery] int month)
        {
            await FileHandler.DownloadStationById(id);
            List<TempValue> tempValues = CsvHandler.GetStationValuesById(id).Where(value => value.year == year && value.month == month).ToList();

            List<TempValue> filteredValues = new List<TempValue>();

            foreach (TempValue tempValue in tempValues)
            {
                var alreadyInList = filteredValues.FindIndex(x => x.day == tempValue.day);

                if (alreadyInList != -1)
                {
                    if(tempValue.minTemp != null)
                    {
                        tempValues[alreadyInList].minTemp = tempValue.minTemp;
                    }
                    if(tempValue.maxTemp != null)
                    {
                        tempValues[alreadyInList].maxTemp = tempValue.maxTemp;
                    }
                }
                else
                {
                    filteredValues.Add(tempValue);
                }
            }

            return new StationResponse { station = new Station() { id = id }, values = filteredValues };
        }
    }
}
