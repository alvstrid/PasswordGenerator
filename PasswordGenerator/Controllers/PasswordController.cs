using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;


namespace PasswordGenerator.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class PasswordController : ControllerBase
    {

        [HttpGet]
        public Password Get(string userId)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                DateTimeOffset now = DateTime.UtcNow;
                long passwordNumber = now.ToUnixTimeSeconds() / 30;
                DateTime validUntil = DateTimeOffset.FromUnixTimeSeconds((passwordNumber + 1) * 30).UtcDateTime;
                
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(userId + '-' + passwordNumber));
                string password = "" + bytes[0]%10 + bytes[1]%10 + bytes[2]%10 + bytes[3]%10 + bytes[4]%10 + bytes[5]%10;

                return new Password
                {
                    UserId = userId,
                    Date = validUntil,
                    GeneratedPassword = password
                };
            }
        }

        
    }
}