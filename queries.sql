-- Multi-Table Query Practice
-- Display the ProductName and CategoryName for all products in the database. Shows 77 records.
select productname,categoryname 
from product as p
join category as c on c.id = p.categoryid 
-- Display the order Id and shipper CompanyName for all orders placed before August 9 2012. Shows 429 records.
select id as OrderId,Companyname as shipper_company_name 
from [Order] as o
join shipper as s on o.shipvia = s.id 
Where o.orderdate < '2012-08-09'
-- Display the name and quantity of the products ordered in order with Id 10251. Sort by ProductName. Shows 3 records.
select o.quantity, p.productname
from orderdetail as o
join product as p on o.productid = p.id
where o.orderid = 10251
order by p.productname
-- Display the OrderID, Customer's Company Name and the employee's LastName for every order. All columns should be labeled clearly. Displays 16,789 records.
select o.id as Order_id, c.companyname as Customer_company, e.lastname as Employee_lastname
from [order] as o
join employee as e on e.id = o.employeeid
join customer as c on c.id = o.customerid