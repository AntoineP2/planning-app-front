import { Spin } from 'antd';

const LoadingPage = () => {
    return (
        <div className="flex justify-center items-center h-[80vh]">
            <Spin size="large" />
        </div>
    );
};

export default LoadingPage;
