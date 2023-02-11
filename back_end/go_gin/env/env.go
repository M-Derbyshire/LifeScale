package env

import (
	"fmt"

	env "github.com/caarlos0/env/v6"
	"github.com/joho/godotenv"
)

// EnvVars holds the environment variables that are stored in the .env file
type EnvVars struct {
	DatabaseString    string `env:"DATABASE_STRING,required"`         // The string used to connect to the database
	Host              string `env:"HOST,required"`                    // The hostname of this application
	Port              string `env:"PORT,required"`                    // The port that this application should use
	PathPrefix        string `env:"PATH_PREFIX,required"`             // The start of all route urls (e.g. "/api/v1" in "/api/v1/user/register")
	JwtKey            string `env:"JWT_KEY,required"`                 // The key used when generating JWTs
	JwtExpirationMins int    `env:"JWT_EXPIRATION_TIME_MIN,required"` // The minutes until a JWT will expire
	EmailFrom         string `env:"EMAIL_FROM"`                       // The email address to send any emails from
	EmailUsername     string `env:"EMAIL_USERNAME"`                   // The username for the SMTP email host
	EmailPassword     string `env:"EMAIL_PASSWORD"`                   // The password for the SMTP email host
	EmailHost         string `env:"EMAIL_HOST"`                       // The SMTP email host
	EmailPort         int    `env:"EMAIL_PORT"`                       // The port to use for SMTP connections
	TlsCertPath       string `env:"TLS_CERT_PATH"`                    // The SSL certificate for secure connections
	TlsKeyPath        string `env:"TLS_KEY_PATH"`                     // The SSL key for secure connections
}

// Loads the .env file variables into an EnvVars object
func LoadEnvVars(customPath string) (EnvVars, error) {
	//First, load and parse the .env file variables

	envLoadErr := godotenv.Load(customPath)
	if envLoadErr != nil {
		return EnvVars{}, fmt.Errorf("unable to load .env file: %e", envLoadErr)
	}

	envVars := EnvVars{} //This will provide the env variables
	envParseErr := env.Parse(&envVars)
	if envParseErr != nil {
		return EnvVars{}, fmt.Errorf("unable to parse environment variables: %e", envParseErr)
	}

	return envVars, nil
}
