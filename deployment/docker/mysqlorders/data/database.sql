
CREATE USER 'orders'@'%' IDENTIFIED BY 'asdf1234';
GRANT ALL PRIVILEGES ON orders.* TO 'orders'@'%';
FLUSH privileges;

DROP DATABASE IF EXISTS orders;
CREATE DATABASE IF NOT EXISTS orders;
use orders;

CREATE TABLE Orders (
    orderID INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    customerID INT UNSIGNED  NOT NULL,
    saledate VARCHAR(100) NOT NULL,
    PRIMARY KEY  (orderID)
);

CREATE TABLE OrderDetails (
    orderdetailsID INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    orderID INT UNSIGNED  NOT NULL,
    productID INT UNSIGNED  NOT NULL,
    quantity INT UNSIGNED  NOT NULL,
    price DECIMAL(7,2)  NOT NULL DEFAULT 99999.99,
    PRIMARY KEY  (orderdetailsID)
);

