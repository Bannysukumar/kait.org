import VoucherUsageTable from './voucherUsageTable';

export default function VoucherUsagePage() {



    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Voucher Usage Summary</h1>

            <VoucherUsageTable />
        </div>
    );
}
