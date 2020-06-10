
const util = {
	// symbol is a string like "OAX/BTC"
	// returns Arraay containing 2 strings ["OAX", BTC"]
	// if parsing failed, returns empty Array
	parseSymbol: function (symbol) {
		var result = symbol.split("/", 2);
		if (result.length === 2)
			return result;
		else return [];
	}
}

export default util;