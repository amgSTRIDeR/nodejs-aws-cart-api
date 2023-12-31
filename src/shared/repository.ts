export default abstract class GenericRepository<DataType, CreateDtoType> {
    abstract findOne(id: string): Promise<DataType>;
    abstract create(dto: CreateDtoType): Promise<DataType>;
  }