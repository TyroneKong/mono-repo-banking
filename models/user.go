package models

type User struct {
	ID       uint   `json:"id" gorm:"PrimaryKey"`
	Name     string `json:"name"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password []byte `json:"-"`
}
