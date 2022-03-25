package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"
	"strings"
	
	"github.com/hyperledger/fabric-chaincode-go/shim"
	sc "github.com/hyperledger/fabric-protos-go/peer"
	"github.com/hyperledger/fabric/common/flogging"
	
	// "github.com/hyperledger/fabric-chaincode-go/pkg/cid"
)

// SmartContract Define the Smart Contract structure
type SmartContract struct {
}

type ProductDetail struct {
	ProductName string `json:"productName"`
	Id string `json:"id"`
	Pid string `json:"pid"`
	OwnerName string `json:"ownerName"`
} 

type Exchange struct {
	Id string `json:"id"`
	ReqUserName string `json:"reqUserName"`
	RecUserName string `json:"recUserName"`
	ListofProduct string `json:"listofProduct"`
	IsAccepted bool `json:"isAccepted"`
	IsConfirm bool `json:"isConfirm"`
	IsActive bool `json:"isActive"`
}


// Init ;  Method for initializing smart contract
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

var logger = flogging.MustGetLogger("fabcar_cc")

// Invoke :  Method for INVOKING smart contract
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	function, args := APIstub.GetFunctionAndParameters()
	logger.Infof("Function name is:  %d", function)
	logger.Infof("Args length is : %d", len(args))
	
	switch function {
	case "queryProductDetail":
		return s.queryProductDetail(APIstub, args)
	case "initLedger":
		return s.initLedger(APIstub)
	case "createProductDetail":
		return s.createProductDetail(APIstub, args)
	case "queryAllProductDetails":
		return s.queryAllProductDetails(APIstub)
	case "changeProductDetail":
		return s.changeProductDetail(APIstub, args)
	case "getHistoryForAsset":
		return s.getHistoryForAsset(APIstub, args)
	case "queryExchange":
		return s.queryExchange(APIstub, args)
	case "createExchange":
		return s.createExchange(APIstub, args)
	case "queryAllExchanges":
		return s.queryAllExchanges(APIstub)
	case "changeExchangeInfor":
		return s.changeExchangeInfor(APIstub, args)
	default:
		return shim.Error("Invalid Smart Contract function name.")
	}

	// return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) queryProductDetail(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	productAsBytes, _ := APIstub.GetState("PDetail-" + args[0])
	return shim.Success(productAsBytes)
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {

	// t, _ := APIstub.GetTxTimestamp()
	ProductDetails := []ProductDetail{
		ProductDetail{Id: "1", Pid: "1", ProductName: "2m-pipe", OwnerName: "StoreA"},
		ProductDetail{Id: "2", Pid: "2", ProductName: "water pipe glue", OwnerName: "StoreB"},
		ProductDetail{Id: "3", Pid: "3", ProductName: "electrical line", OwnerName: "StoreB"},
		ProductDetail{Id: "4", Pid: "4", ProductName: "water handler", OwnerName: "StoreB"},
		ProductDetail{Id: "5", Pid: "5", ProductName: "water pump", OwnerName: "StoreB"},
		ProductDetail{Id: "6", Pid: "5", ProductName: "water pump", OwnerName: "StoreA"},
		ProductDetail{Id: "7", Pid: "5", ProductName: "water pump", OwnerName: "StoreA"},
		ProductDetail{Id: "8", Pid: "5", ProductName: "water pump", OwnerName: "StoreB"},
		ProductDetail{Id: "9", Pid: "5", ProductName: "water pump", OwnerName: "StoreB"},
	}

	i := 0
	for i < len(ProductDetails) {
		productDetailAsBytes, _ := json.Marshal(ProductDetails[i])
		APIstub.PutState("PDetail-" + ProductDetails[i].Id, productDetailAsBytes)
		i = i + 1
	}
	
	exchanges := []Exchange{
		Exchange{Id: "1", ReqUserName: "StoreA", RecUserName: "StoreB", ListofProduct:"1-2,3-3",IsAccepted: false,IsConfirm: false , IsActive: true},
		Exchange{Id: "2", ReqUserName: "StoreA", RecUserName: "StoreB", ListofProduct:"1-2,3-2",IsAccepted: false,IsConfirm: false , IsActive: true},
	}

	j := 0
	for j < len(exchanges) {
		exchangeAsBytes, _ := json.Marshal(exchanges[j])
		APIstub.PutState("Exchange-" + exchanges[j].Id, exchangeAsBytes)
		j = j + 1
	}

	return shim.Success(nil)
}

func (s *SmartContract) createProductDetail(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	
	id := strconv.Itoa(getLast(APIstub, "PDetail-") + 1)
	// t, _ := APIstub.GetTxTimestamp()
	var productDetail = ProductDetail{Id: id,Pid: args[0], ProductName: args[1], OwnerName: args[2]}

	productDetailAsBytes, _ := json.Marshal(productDetail)
	APIstub.PutState("PDetail-" + productDetail.Id, productDetailAsBytes)

	// indexName := "owner~key"
	// colorNameIndexKey, err := APIstub.CreateCompositeKey(indexName, []string{car.Owner, args[0]})
	// if err != nil {
	// 	return shim.Error(err.Error())
	// }
	// value := []byte{0x00}
	// APIstub.PutState(colorNameIndexKey, value)

	return shim.Success(productDetailAsBytes)
}


func (s *SmartContract) queryAllProductDetails(APIstub shim.ChaincodeStubInterface) sc.Response {

	resultsIterator, err := APIstub.GetStateByRange("PDetail-1", "PDetail-9999")
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		// buffer.WriteString("{\"Key\":")
		// buffer.WriteString("\"")
		// buffer.WriteString(queryResponse.Key)
		// buffer.WriteString("\"")

		// buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		// buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllExchange:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func getLast(APIstub shim.ChaincodeStubInterface, typ string) int {
	resultsIterator, err := APIstub.GetStateByRange(typ + "1", typ + "9999")
	if err != nil {
		return 0
	}
	var result ProductDetail
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return 0
		}
		json.Unmarshal(queryResponse.Value, &result)
		fmt.Println(result.Id)
	}
	id, _ := strconv.Atoi(result.Id)
	return id
}

func queryListOfProductDetail(APIstub shim.ChaincodeStubInterface, args []string) string{

	resultsIterator, err := APIstub.GetStateByRange("PDetail-1", "PDetail-9999")
	if err != nil {
		return ""
	}
	var result ProductDetail
	
	defer resultsIterator.Close()

	taken := make(map[string]int)
	listofIDs := strings.Split(args[0], ",")

	for _, i := range(listofIDs){
		slice := strings.Split(i, "-")
		taken[slice[0]], _ = strconv.Atoi(slice[1])
	}
	var tempS string = "" 
	// var buffer bytes.Buffer
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return ""
		}
		json.Unmarshal(queryResponse.Value, &result)
		count, ok := taken[result.Pid]
		if(ok && count >0 && result.OwnerName == args[1]) {
			// buffer.WriteString(result.Id + "-")
			tempS = tempS + result.Id + "-"
			taken[result.Pid] = taken[result.Pid] - 1
		}
		
	}

	fmt.Printf("- queryListOfProductDetail returning:\n%s\n", tempS)
	// finalString := buffer.String()
	return tempS[0:len(tempS)-1]
}



func (s *SmartContract) changeProductDetail(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	// if len(args) != 3 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 2")
	// }
	exchange := Exchange{}
	exchangeAsBytes, _ := APIstub.GetState("Exchange-" + args[0])
	json.Unmarshal(exchangeAsBytes, &exchange)

	var lst string
	// t, _ := APIstub.GetTxTimestamp()
	// if strings.Contains(exchange.ListofProduct, ","){
	los := []string {exchange.ListofProduct, exchange.RecUserName}
	lst = queryListOfProductDetail(APIstub, los)
	// } else {
	// 	lst = exchange.ListofProduct
	// }
	listofIDs := strings.Split(lst, "-")
	for _, i := range(listofIDs){
		productDetailAsBytes, _ := APIstub.GetState("PDetail-" + i)
		productDetail := ProductDetail{}
	
		json.Unmarshal(productDetailAsBytes, &productDetail)
		productDetail.OwnerName = exchange.ReqUserName
		// productDetail.LastUpdate = t.String()
	
		productDetailAsBytes, _ = json.Marshal(productDetail)
		APIstub.PutState("PDetail-" + productDetail.Id, productDetailAsBytes)
	}
	
	
	return shim.Success(exchangeAsBytes)
}


func (t *SmartContract) getHistoryForAsset(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	// if len(args) < 1 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 1")
	// }

	carName := "PDetail-" + args[0]

	resultsIterator, err := stub.GetHistoryForKey(carName)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing historic values for the marble
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		// if it was a delete operation on given key, then we need to set the
		//corresponding value null. Else, we will write the response.Value
		//as-is (as the Value itself a JSON marble)
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getHistoryForAsset returning:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) queryExchange(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	// if len(args) != 1 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 1")
	// }

	productAsBytes, _ := APIstub.GetState("Exchange-" + args[0])
	return shim.Success(productAsBytes)
}

func (s *SmartContract) createExchange(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	id := strconv.Itoa(getLast(APIstub, "Exchange-") + 1)
	// t, _ := APIstub.GetTxTimestamp()
	var exchange = Exchange{Id: id, ReqUserName: args[0], RecUserName: args[1], ListofProduct: args[2], IsAccepted: false, IsConfirm: false}

	exchangeAsBytes, _ := json.Marshal(exchange)
	APIstub.PutState("Exchange-" + exchange.Id, exchangeAsBytes)

	// indexName := "owner~key"
	// colorNameIndexKey, err := APIstub.CreateCompositeKey(indexName, []string{car.Owner, args[0]})
	// if err != nil {
	// 	return shim.Error(err.Error())
	// }
	// value := []byte{0x00}
	// APIstub.PutState(colorNameIndexKey, value)

	return shim.Success(exchangeAsBytes)
}

func (s *SmartContract) queryAllExchanges(APIstub shim.ChaincodeStubInterface) sc.Response {

	resultsIterator, err := APIstub.GetStateByRange("Exchange-1", "Exchange-9999")
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		// buffer.WriteString("{\"Key\":")
		// buffer.WriteString("\"")
		// buffer.WriteString(queryResponse.Key)
		// buffer.WriteString("\"")

		// buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		// buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllExchange:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}


func (s *SmartContract) changeExchangeInfor(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	// if len(args) != 3 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 2")
	// }
	// t, _ := APIstub.GetTxTimestamp()
	exchangeAsBytes, _ := APIstub.GetState("Exchange-" + args[0])
	exchange := Exchange{}

	json.Unmarshal(exchangeAsBytes, &exchange)
	if args[1] == "isAccepted"{
		exchange.IsAccepted = true
	} else if args[1] == "isConfirm"{
		exchange.IsConfirm = true
	} else if args[1] == "delete"{
		exchange.IsActive = false
	} else {
		return shim.Error("Incorrect argument name. Expecting isAccepted | isConfirm")
	}
	// exchange.LastUpdate = t.String()
	exchangeAsBytes, _ = json.Marshal(exchange)
	APIstub.PutState("Exchange-" + exchange.Id, exchangeAsBytes)
	
	// fmt.Println(t)
	return shim.Success(exchangeAsBytes)
}


// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}

