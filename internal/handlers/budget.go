package handlers

import (
	"errors"
	"finance/database"
	"finance/models"
	"log"
	"strconv"

	"github.com/gofiber/fiber/v3"
)

type Budget struct {
	ID        string  `gorm:"primary key;autoIncrement" json:"id"`
	UserID    string  `gorm:"not null" json:"userid"`
	Name      string  `gorm:"not null" json:"name"`
	Amount    float64 `gorm:"not nul" json:"amount"`
	Type      string  `gorm:"not null" json:"type"`
	CreatedAt string  `gorm:"autoCreateTime" json:"created_at"`
}

func NewBudget(data map[string]string, amount float64) *models.Budget {

	return &models.Budget{
		UserID: data["userId"],
		Name:   data["name"],
		Amount: amount,
		Type:   data["type"],
	}

}

func HandleCreateBudget(c fiber.Ctx) error {
	var user User
	var data map[string]string
	if err := c.Bind().Body(&data); err != nil {
		return err

	}
	if err := database.DB.First(&user, "id = ?", data["userId"]).Error; err != nil {
		return errors.New("unable to locate user")

	}

	amount, _ := strconv.ParseFloat(data["amount"], 64)

	budget := NewBudget(data, amount)
	database.DB.Create(&budget)
	log.Printf("budget has been created for user %v", user.Name)
	return c.Status(200).JSON(fiber.Map{
		"message": "budget created",
		"data":    budget,
	})
}

func getAllBudgets() ([]Budget, error) {
	var budget []Budget
	if err := database.DB.Find(&budget).Error; err != nil {
		return budget, errors.New("unable to retrieve bugets")
	}

	return budget, nil

}

func HandleGetAllBudgets(c fiber.Ctx) error {
	budget, err := getAllBudgets()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "no budgets found",
		})

	}
	return c.Status(200).JSON(&budget)

}
