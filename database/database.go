package database

import (
	"finance/models"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {

	connection, err := gorm.Open(mysql.Open("root:root@/finance"), &gorm.Config{})
	if err != nil {
		log.Panic("could not connect to the database")
	} else {
		log.Println("connected to the database")
	}
	DB = connection

	connection.AutoMigrate(&models.User{})
	connection.AutoMigrate(&models.Transaction{})
	connection.AutoMigrate(&models.Expense{})
	connection.AutoMigrate(&models.Budget{})

}
