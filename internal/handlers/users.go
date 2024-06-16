package handlers

import (
	"errors"
	"finance/database"
	"log"
	"os"

	"github.com/gofiber/fiber/v3"

	"github.com/golang-jwt/jwt/v5"
)

type User struct {
	ID uint `json:"id" gorm:"PrimaryKey"`
	Name     string `json:"name"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password []byte `json:"-"`
}

func HandleGetUser(c fiber.Ctx) error {

	var user User
	id, err := c.ParamsInt("id")

	if err != nil {
		return errors.New("please provide a valid id")
	}

	if err := database.DB.Find(&user, id).Error; err != nil {
		return errors.New("unable to find user")
	}

	return c.Status(200).JSON(user)

}

func HandleGetCurrentUser(c fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)

		log.Println("checking signing method")
		if !ok {
			return nil, errors.New(("unexpected sign in method"))
		}
		return []byte(os.Getenv("API_SECRET")), nil

	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized)

		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}

	claims := token.Claims.(*jwt.RegisteredClaims)

	var user User

	issuer, err := claims.GetIssuer()

	if err != nil {
		return c.JSON(fiber.Map{
			"message": "unable to get issuer",
		})
	}

	database.DB.Where("id = ?", issuer).First(&user)
	return c.JSON(user)

}
