import { EntityRepository, Repository } from "typeorm";
import { Account } from "../entities/account.entity";
import { History } from "../entities/history.entity";
import { buildPaginator } from "typeorm-cursor-pagination";

export enum typeOptions {
	deposit = "deposit",
	withdraw = "withdraw",
	all = "all"
}

interface PagingResult<Entity> {
	data: Entity[];
	cursor: Cursor;
}

interface Cursor {
	beforeCursor: string | null;
	afterCursor: string | null;
}

@EntityRepository(History)
export class HistoryRepository extends Repository<History> {
	async depositHistory(
		accountNum: string,
		type: string,
		startDate: string,
		endDate: string,
		briefs: string,
		minAmount: number,
		maxAmount: number,
		pageNum: number
	) {
		// const page = pageNum * 10 || 0;
		const historyQuery = await this.createQueryBuilder("h")
			// .select("h.type", "거래종류")
			// .addSelect("h.amount", "사용 금액")
			// .addSelect("h.historyBalance", "거래후 잔액")
			// .addSelect("h.briefs", "적요")
			// .addSelect("h.createdAt", "거래일시")
			.innerJoin(Account, "a", "a.accountNum = h.accountNum");
		if (type === typeOptions.deposit) historyQuery.where("h.type = TRUE");
		if (type === typeOptions.withdraw) historyQuery.where("h.type = FALSE");
		if (type === typeOptions.all)
			historyQuery.where("h.type = TRUE OR h.type = FALSE");
		historyQuery.andWhere("h.accountNum = :accountNum", {
			accountNum: accountNum
		});
		if (startDate != undefined && endDate != undefined)
			historyQuery.andWhere(
				"h.createdAt BETWEEN :startDate AND :endDate",
				{
					startDate: startDate,
					endDate: endDate
				}
			);
		if (briefs != undefined)
			historyQuery.andWhere("h.briefs = :briefs", { briefs: briefs });
		if (minAmount != 0 && maxAmount != 0)
			historyQuery.andWhere(
				"h.createdAt BETWEEN :minAmount AND :maxAmount",
				{
					minAmount: minAmount,
					maxAmount: maxAmount
				}
			);
		// historyQuery.offset(page);
		// historyQuery.limit(10);
		// return historyQuery.getRawMany();
		// historyQuery.getRawMany();

		const paginator = buildPaginator({
			entity: History,
			alias: "h",
			paginationKeys: ["historyId"],
			query: {
				limit: 10,
				order: "DESC"
			}
		});

		const { data, cursor } = await paginator.paginate(historyQuery);

		// const nextPaginator = buildPaginator({
		// 	entity: History,
		// 	alias: "h",
		// 	paginationKeys: ["historyId"],
		// 	query: {
		// 		limit: 10,
		// 		order: "DESC",
		// 		afterCursor: cursor.afterCursor
		// 	}
		// });

		return null;
	}

	// private CheckHistoryId(historyId: string) {
	// 	if (historyId === null) {
	// 		return null;
	// 	}
	// }
}