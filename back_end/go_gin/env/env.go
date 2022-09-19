package env

import (
	"fmt"

	env "github.com/caarlos0/env/v6"
	"github.com/joho/godotenv"
)

type EnvVars struct {
	DatabaseString string `env:"DATABASE_STRING,required"`
	Host           string `env:"HOST,required"`
	Port           string `env:"PORT,required"`
}

func LoadEnvVars() (EnvVars, error) {
	//First, load and parse the .env file variables

	envLoadErr := godotenv.Load()
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
