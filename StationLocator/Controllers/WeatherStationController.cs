﻿using Microsoft.AspNetCore.Mvc;
using StationLocator.Models;

namespace StationLocator.Controllers
{
    [Route("WeatherStation")]
    [ApiController]
    public class WeatherStationController : ControllerBase
    {
        // GET WeatherStation/
        [HttpGet]
        public StationResponse Get([FromQuery] float latitude, [FromQuery] float longitude, [FromQuery] string? country, [FromQuery] int? startYear, [FromQuery] int? endYear, [FromQuery] int? radius, [FromQuery] int count = 5)
        {
            return new StationResponse() { values = CsvHandler.FindStations(latitude, longitude, country, startYear, endYear, radius, count) };
        }

        [HttpGet("/{id}/range")]
        public async Task<TempValueResponse> GetRange(string id, [FromQuery] int startYear, [FromQuery] int endYear)
        {
            await FileHandler.DownloadStationById(id);
            List<TempValue> tempValues = CsvHandler.GetStationValuesById(id).Where(value => value.year >= startYear && value.year <= endYear).ToList();
            
            return new TempValueResponse() { values = CsvHandler.GetMeanTempYears(tempValues) };
        }

        [HttpGet("/{id}/year")]
        public async Task<TempValueResponse> GetYear(string id, [FromQuery] int year)
        {
            await FileHandler.DownloadStationById(id);
            List<TempValue> tempValues = CsvHandler.GetStationValuesById(id).Where(value => value.year == year).ToList();

            return new TempValueResponse() { values = CsvHandler.GetMeanTempMonths(tempValues) };
        }

        [HttpGet("/{id}/month")]
        public async Task<TempValueResponse> GetMonth(string id, [FromQuery] int year, [FromQuery] int month)
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

            return new TempValueResponse() { values = filteredValues };
        }
    }
}
