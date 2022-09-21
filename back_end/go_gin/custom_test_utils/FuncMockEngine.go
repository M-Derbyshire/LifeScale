package customtestutils

// Provides a method to be used by mock functions/methods, to record what they were called with.
// Also provides a method to clear that data
type FuncMockEngine struct {
	Calls []FuncMockCall
}

// Represents a call to a function
type FuncMockCall struct {
	FuncName   string
	Parameters []interface{}
}

func (fme *FuncMockEngine) ClearCalls() {
	fme.Calls = []FuncMockCall{}
}

func (fme *FuncMockEngine) RecordCall(funcName string, parameters []interface{}) {
	fme.Calls = append(fme.Calls, FuncMockCall{FuncName: funcName, Parameters: parameters})
}
