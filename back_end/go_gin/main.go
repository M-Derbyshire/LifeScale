package main

import (
	"fmt"
	"log"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/env"
)

func main() {

	envVars, envErr := env.LoadEnvVars()
	if envErr != nil {
		log.Fatal(envErr)
	}

	fmt.Println(envVars.DatabaseString)
	fmt.Println(envVars.Host)
	fmt.Println(envVars.Port)

}
