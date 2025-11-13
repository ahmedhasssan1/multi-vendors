import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClientAccount{
    @PrimaryGeneratedColumn()
    id:number

    @Column(()=>String)
    financial_account:string

    @Column()
    client_id:number;

}