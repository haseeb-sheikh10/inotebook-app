const development = {

    host: 'http://localhost:5000',
};

const production = {
    host: 'http://3.110.164.135', // Replace with your EC2 instance public IP or domain
};

const config = process.env.NODE_ENV === 'production' ? production : development;

export default config;