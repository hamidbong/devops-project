from setuptools import setup, find_packages

setup(
    name="dashboard-service",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        'flask>=2.0.0',
    ],
)