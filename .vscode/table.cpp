#include <iostream>
using namespace std;

int main()
{ //table of N till n terms
    int N,n;
    cout<<"Enter the table of which number you want:";
    cin>>N;
    cout<<"Enter the terms till you want the table:";
    cin>>n;
    for(int i=1; i<=n ;i++)
    {
        cout<<N<<"*"<<i<<"="<<N*i<<endl;
    }





}