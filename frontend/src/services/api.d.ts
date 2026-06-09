declare class ApiClient {
    private client;
    constructor();
    get<T>(url: string, config?: any): Promise<import("axios").AxiosResponse<T, any, {}>>;
    post<T>(url: string, data?: any, config?: any): Promise<import("axios").AxiosResponse<T, any, {}>>;
    patch<T>(url: string, data?: any, config?: any): Promise<import("axios").AxiosResponse<T, any, {}>>;
    delete<T>(url: string, config?: any): Promise<import("axios").AxiosResponse<T, any, {}>>;
}
export declare const api: ApiClient;
export {};
//# sourceMappingURL=api.d.ts.map