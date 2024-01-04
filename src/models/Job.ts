type Job = {
    id: string;
    owner_id: string;
    owner_name: string;
    target_id: string;
    target_name: string;
    title: string;
    reference: string;
    own: boolean;
    status: string;
    current_step_id: string;
    performer_user: string;
    performer_user_id: string;
    performer: Object;
    status_name: string;
    due_date: string;
    start_date: string;
    end_date: string;
    created_at: number;
    updated_at: number;
    work_order_address: {
        address: string;
        location: string;
    };
    tags: Array<string>;
};

export default Job;
