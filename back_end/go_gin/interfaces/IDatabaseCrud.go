package interfaces

//At this time, this interface defines the currently used methods on the GORM DB type.
//Whenever using different methods, you should add them to this interface (and to the MockDatabaseCrud type -- which
//is why this interface is here)
type IDatabaseCrud interface {
	Count(count *int64) *IDatabaseCrud
	Create(value interface{}) *IDatabaseCrud
	Delete(value interface{}, conds ...interface{}) *IDatabaseCrud
	Find(dest interface{}, conds ...interface{}) *IDatabaseCrud
	First(dest interface{}, conds ...interface{}) *IDatabaseCrud
	Joins(query string, args ...interface{}) *IDatabaseCrud
	Pluck(column string, dest interface{}) *IDatabaseCrud
	Select(query interface{}, args ...interface{}) *IDatabaseCrud
	Update(column string, value interface{}) *IDatabaseCrud
	Updates(values interface{}) *IDatabaseCrud
	Where(query interface{}, args ...interface{}) *IDatabaseCrud
}
