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
        public List<Station> Get([FromQuery] float longitude, [FromQuery] float latitude, [FromQuery] string? country, [FromQuery] int? years, [FromQuery] int? radius, [FromQuery] int count = 5)
        {
            return CsvHandler.FindStations(longitude, latitude, country, years, radius, count);
        }

        [HttpGet("/{id}/range")]
        public async Task<List<TempValue>> GetRange(string id, [FromQuery] int startYear, [FromQuery] int endYear)
        {
            await FileHandler.DownloadStationById(id);
            List<TempValue> tempValues = CsvHandler.GetStationValuesById(id).Where(value => value.year >= startYear && value.year <= endYear).ToList();
            
            return CsvHandler.GetMeanTempYears(tempValues);
        }

        [HttpGet("/{id}/year")]
        public async Task<List<TempValue>> GetYear(string id, [FromQuery] int year)
        {
            await FileHandler.DownloadStationById(id);
            List<TempValue> tempValues = CsvHandler.GetStationValuesById(id).Where(value => value.year == year).ToList();

            return CsvHandler.GetMeanTempMonths(tempValues);
        }

        [HttpGet("/{id}/month")]
        public async Task<List<TempValue>> GetMonth(string id, [FromQuery] int year, [FromQuery] int month)
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

            return filteredValues;
        }
    }
}
