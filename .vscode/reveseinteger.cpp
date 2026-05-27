#include <iostream>
using namespace std;
 int main()
 {
    int n,num;
    cout<<"Enter the number n:";
    cin>>n;
    num=n;
    int ans=0;
    int ld=0;
    int mul=10;
    while(num !=0)
    {
        ld=num%10;
        ans=ans*mul+ld;
        
        num=num/10;

    }
    cout<<ans;
 }