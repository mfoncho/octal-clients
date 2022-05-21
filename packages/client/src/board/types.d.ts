export interface CreateBoardRequest {
    space_id: string;
    params: {
        name: string;
    };
}

export interface UpdateBoardRequest {
    board_id: string;
    space_id: string;
    params: {
        name?: string;
    };
}

export interface BoardRequest {
    board_id: string;
    space_id: string;
}
