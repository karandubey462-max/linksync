#include <iostream>
using namespace std;

int main()
{
    int n;
    cout<<"Enter the number n :";
    cin>>n;
    for(int row =n ; row>=1 ; row--)
    {
     for(int col =1; col<=row-1 ; col++)
     {   
        cout<<" ";
     }   
     for(int col=row ; col<=2*row-1 ; col++)
     {
        cout<<"*";
        
     }
     for(int col =1 ; col<=row-1 ;row++)
     {
        cout<<" ";
     }
    }   
 }