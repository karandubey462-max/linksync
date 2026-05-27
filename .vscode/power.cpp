#include <iostream>
using namespace std;

int main()
{ int num,n,m;
    //n=base
    //m=power
    cout<<"Enter the base:";
    cin>>n;
    cout<<"Enter the power:";
    cin>>m;
    num=n;

    for(int i=1; i<m; i++)
    {
        num=num*n;
    }

    cout<<n<<" to the power "<< m <<" is :"<<num;

}