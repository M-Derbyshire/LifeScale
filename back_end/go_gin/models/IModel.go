package models

type IModel interface {
	Validate() error
}
