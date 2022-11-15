USE crossdomain
CREATE TABLE user (
  userId integer NOT NULL AUTO_INCREMENT PRIMARY KEY
  ,name varchar(50) NOT NULL
  ,email varchar(100) NOT NULL
  ,password varchar(1000) NOT NULL
  ,gender varchar(45) NOT NULL
  ,age integer(11) NOT NULL
);

ALTER TABLE `crossdomain`.`user` 
ADD UNIQUE INDEX `email` (`email` ASC);

ALTER TABLE crossdomain.user AUTO_INCREMENT=611;