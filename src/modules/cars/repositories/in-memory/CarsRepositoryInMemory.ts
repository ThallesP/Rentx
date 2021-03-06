import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";

import { ICarsRepository } from "../ICarsRepository";

export class CarsRepositoryInMemory implements ICarsRepository {
  private cars: Car[];

  constructor() {
    this.cars = [];
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const carIndex = this.cars.findIndex((car) => car.id === id);

    this.cars[carIndex].available = available;
  }

  async findById(id: string): Promise<Car> {
    const car = this.cars.find((car) => car.id === id);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }

  async create({
    name,
    category_id,
    brand,
    daily_rate,
    fine_amount,
    license_plate,
    specifications,
    id,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      name,
      category_id,
      brand,
      daily_rate,
      fine_amount,
      license_plate,
      specifications,
      ...(id && { id }),
    });

    this.cars.push(car);

    return car;
  }

  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]> {
    const cars = this.cars.filter((car) => {
      if (!car.available) return false;

      if (brand && car.brand === brand) return true;
      if (category_id && car.category_id === category_id) return true;
      if (name && car.name === name) return true;

      if (brand || category_id || name) return false;

      return true;
    });

    return cars;
  }
}
