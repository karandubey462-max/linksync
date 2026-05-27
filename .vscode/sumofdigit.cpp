#include <iostream>
using namespace std;
 
int main()
{
    int n;
    cout<<"Enter the number n:";
    cin>>n;
    
    int num=n;
    while(num>9)

   {
     int ld=0;
    int sum=0;
     while(num>0)
     {
        ld=num%10;
        sum=sum+ld;
        num=num/10;
        }
        num=sum;
   }  
    cout<<num;
    
}