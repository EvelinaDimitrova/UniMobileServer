var crypto = require("crypto");

//Function to create random hash key
function createSalt() {
	//define the length of the salt
	var len = 8;
	//create the hash
	return crypto.randomBytes(Math.ceil(len/2)).toString('hex').substring(0,len);
}

//gets a hashed value from the provided source string and salt key 
function computeHash (source, salt) { 
	//get hashing algorithm
	var hmac = crypto.createHmac("sha1", salt);
	//create the hash number	
	var hash = hmac.update(source);
	//get the hash as hex string
	return hash.digest("hex");
}

exports.createSalt = createSalt;
exports.computeHash = computeHash;