CREATE TABLE product_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    stock INT
);

CREATE TABLE customer_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255)
);

CREATE TABLE invoice_transaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    product_id INT,
    quantity INT,
    total_price DECIMAL(10, 2),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer_info(id),
    FOREIGN KEY (product_id) REFERENCES product_info(id)
);

CREATE TABLE sali_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    saldo DECIMAL(10, 2),
    report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product_info(id)
);

CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT,
    log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
