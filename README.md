# Cross-Domain-Recommender-System
A book recommender web application which transfers knowledge from movies domain to books domain. 


## Installation
**1.** Clone the project.

**2.** Navigate to the project directory.

```bash
cd Cross-Domain-Recommender-System
```
**3.** Run the following command.

```bash
node app.js
```

Server starts running at https://localhost:3000

🛈**Note**🛈

Create a local database with name 'crossdomain' and create a 'user' table in it.
Add your database connection credentials in .env file.
Preferred tool- mysql workbench

🛈**SQL queries**🛈

**1.** 
```bash
CREATE TABLE `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `gender` varchar(45) NOT NULL,
  `age` int(11) NOT NULL,
  PRIMARY KEY (`userId`)
)
```

**2.** 
```bash
ALTER TABLE `crossdomain`.`user` 
ADD UNIQUE INDEX `email` (`email` ASC);
```

