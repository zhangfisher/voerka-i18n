import {Table, Column} from "typeorm";

@Table()
export class Photo {

    @Column(t("编码"))
    id: number;

    @Column(t("名称"))
    name: string;

    @Column(t("描述"))
    description: string;

    @Column(t("文件名称"))
    fileName: string;

    @Column("视图")
    views: number; 
}