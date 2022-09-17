package main

import (
	"fmt"
	"log"

	env "github.com/caarlos0/env/v6"
	"github.com/joho/godotenv"
)

type EnvVars struct {
	DatabaseString string `env:"DATABASE_STRING,required"`
	Host           string `env:"HOST,required"`
	Port           string `env:"PORT,required"`
}

func main() {

	//First, load and parse the .env file variables

	envLoadErr := godotenv.Load()
	if envLoadErr != nil {
		log.Fatalf("unable to load .env file: %e", envLoadErr)
	}

	envVars := EnvVars{} //This will provide the env variables
	envParseErr := env.Parse(&envVars)
	if envParseErr != nil {
		log.Fatalf("unable to parse environment variables: %e", envParseErr)
	}

	fmt.Println(envVars.DatabaseString)
	fmt.Println(envVars.Host)
	fmt.Println(envVars.Port)

}
