-- MySQL / MariaDB Script
-- Generated for MariaDB compatibility
-- Schema: flottakezelo_db

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema flottakezelo_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `flottakezelo_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `flottakezelo_db` ;

-- -----------------------------------------------------
-- Table `flottakezelo_db`.`vehicles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `flottakezelo_db`.`vehicles` (
  `vehicle_id` INT NOT NULL AUTO_INCREMENT,
  `created_at` DATE NOT NULL,
  `next_technical_exam` DATE NOT NULL,
  `year` VARCHAR(4) NOT NULL,
  `model` VARCHAR(30) NOT NULL,
  `brand` VARCHAR(20) NOT NULL,
  `vin` VARCHAR(17) NOT NULL,
  `start_odometer` INT NOT NULL,
  `insurance_expiry` DATE NOT NULL,
  `lisence_plate` VARCHAR(7) NOT NULL,
  PRIMARY KEY (`vehicle_id`),
  UNIQUE INDEX `vehicle_id_UNIQUE` (`vehicle_id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `flottakezelo_db`.`travel_document`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `flottakezelo_db`.`travel_document` (
  `log_id` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `start_km` INT NOT NULL,
  `end_km` INT NOT NULL,
  `vehicle_id` INT NOT NULL,
  PRIMARY KEY (`log_id`),
  UNIQUE INDEX `log_id_UNIQUE` (`log_id` ASC),
  INDEX `vehicle_id_idx` (`vehicle_id` ASC),
  CONSTRAINT `fk_travel_vehicle`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `flottakezelo_db`.`vehicles` (`vehicle_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `flottakezelo_db`.`fuelings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `flottakezelo_db`.`fuelings` (
  `fueling_id` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `amount_liters` INT NOT NULL,
  `price_per_liter` INT NOT NULL,
  `vehicle_id` INT NOT NULL,
  PRIMARY KEY (`fueling_id`),
  UNIQUE INDEX `fueling_id_UNIQUE` (`fueling_id` ASC),
  INDEX `vehicle_id_idx` (`vehicle_id` ASC),
  CONSTRAINT `fk_fueling_vehicle`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `flottakezelo_db`.`vehicles` (`vehicle_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `flottakezelo_db`.`services`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `flottakezelo_db`.`services` (
  `service_id` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `next_service` DATE NULL,
  `vehicle_id` INT NOT NULL,
  PRIMARY KEY (`service_id`),
  UNIQUE INDEX `service_id_UNIQUE` (`service_id` ASC),
  INDEX `vehicle_id_idx` (`vehicle_id` ASC),
  CONSTRAINT `fk_service_vehicle`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `flottakezelo_db`.`vehicles` (`vehicle_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `flottakezelo_db`.`services_list`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `flottakezelo_db`.`services_list` (
  `name` VARCHAR(45) NOT NULL,
  `service_list_id` INT NOT NULL AUTO_INCREMENT,
  `cost` INT NOT NULL,
  `service_id` INT NOT NULL,
  PRIMARY KEY (`service_list_id`),
  UNIQUE INDEX `service_list_id_UNIQUE` (`service_list_id` ASC),
  INDEX `service_id_idx` (`service_id` ASC),
  CONSTRAINT `fk_list_service`
    FOREIGN KEY (`service_id`)
    REFERENCES `flottakezelo_db`.`services` (`service_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `flottakezelo_db`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `flottakezelo_db`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL, -- Megemeltem a hosszt a hashelt jelszavak miatt
  `role` ENUM('admin', 'driver') NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `flottakezelo_db`.`drivers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `flottakezelo_db`.`drivers` (
  `driver_id` INT NOT NULL AUTO_INCREMENT,
  `license_number` VARCHAR(45) NOT NULL,
  `address` VARCHAR(100) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `starting_date` DATE NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`driver_id`),
  UNIQUE INDEX `driver_id_UNIQUE` (`driver_id` ASC),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  CONSTRAINT `fk_driver_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `flottakezelo_db`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `flottakezelo_db`.`driver_assignment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `flottakezelo_db`.`driver_assignment` (
  `assignment_id` INT NOT NULL AUTO_INCREMENT,
  `assigned_from` DATE NOT NULL,
  `assigned_to` DATE NOT NULL,
  `vehicle_id` INT NOT NULL,
  `driver_id` INT NOT NULL,
  PRIMARY KEY (`assignment_id`),
  UNIQUE INDEX `assignment_id_UNIQUE` (`assignment_id` ASC),
  INDEX `vehicle_id_idx` (`vehicle_id` ASC),
  INDEX `driver_id_idx` (`driver_id` ASC),
  CONSTRAINT `fk_assignment_vehicle`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `flottakezelo_db`.`vehicles` (`vehicle_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_assignment_driver`
    FOREIGN KEY (`driver_id`)
    REFERENCES `flottakezelo_db`.`drivers` (`driver_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;